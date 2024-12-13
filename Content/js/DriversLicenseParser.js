export default class DriversLicenseParser {
	#textarea;
	#timeout;
	#message = 'Waiting for scan...';
	#update = null;
	#complete = null;

	//#region mappings

	#dataFields = {
		// Personal Information
		DCS: 'last_name',
		DAC: 'first_name',
		DAD: 'middle_name',
		DCU: 'name_suffix',

		// Address Information
		DAG: 'address_1',
		DAH: 'address_2',
		DAI: 'city',
		DAJ: 'state',
		DAK: 'postal_code',

		// License Information
		DAQ: 'license_number',
		DBD: 'issue_date',
		DBA: 'expiration_date',
		DCF: 'doc_discriminator',
		DCK: 'inventory_control',

		// Physical Description
		DBB: 'dob',
		DBC: 'gender',
		DAY: 'eye_color',
		DAU: 'height',
		DAW: 'weight',
		DAZ: 'hair_color',
		DCL: 'race',

		// Additional Information
		DCG: 'country',
		DCA: 'vehicle_class',
		DCR: 'restrictions',
		DCB: 'restrictions', // Newer?
		DCQ: 'endorsements',
		DCD: 'endorsements', // Newer?

		// Other possible fields
		DAA: 'full_name',
		DAB: 'family_name',
		DAE: 'name_suffix',
		DAF: 'name_prefix',
		DDE: 'physical_description',
		DDF: 'residence_street_address',
		DDG: 'residence_city_state',
	};

	#stateMapping = {
		// Full names to two-letter codes
		ALABAMA: 'AL',
		ALASKA: 'AK',
		ARIZONA: 'AZ',
		ARKANSAS: 'AR',
		CALIFORNIA: 'CA',
		COLORADO: 'CO',
		CONNECTICUT: 'CT',
		DELAWARE: 'DE',
		FLORIDA: 'FL',
		GEORGIA: 'GA',
		HAWAII: 'HI',
		IDAHO: 'ID',
		ILLINOIS: 'IL',
		INDIANA: 'IN',
		IOWA: 'IA',
		KANSAS: 'KS',
		KENTUCKY: 'KY',
		LOUISIANA: 'LA',
		MAINE: 'ME',
		MARYLAND: 'MD',
		MASSACHUSETTS: 'MA',
		MICHIGAN: 'MI',
		MINNESOTA: 'MN',
		MISSISSIPPI: 'MS',
		MISSOURI: 'MO',
		MONTANA: 'MT',
		NEBRASKA: 'NE',
		NEVADA: 'NV',
		'NEW HAMPSHIRE': 'NH',
		'NEW JERSEY': 'NJ',
		'NEW MEXICO': 'NM',
		'NEW YORK': 'NY',
		'NORTH CAROLINA': 'NC',
		'NORTH DAKOTA': 'ND',
		OHIO: 'OH',
		OKLAHOMA: 'OK',
		OREGON: 'OR',
		PENNSYLVANIA: 'PA',
		'RHODE ISLAND': 'RI',
		'SOUTH CAROLINA': 'SC',
		'SOUTH DAKOTA': 'SD',
		TENNESSEE: 'TN',
		TEXAS: 'TX',
		UTAH: 'UT',
		VERMONT: 'VT',
		VIRGINIA: 'VA',
		WASHINGTON: 'WA',
		'WEST VIRGINIA': 'WV',
		WISCONSIN: 'WI',
		WYOMING: 'WY',
		'DISTRICT OF COLUMBIA': 'DC',
		'AMERICAN SAMOA': 'AS',
		GUAM: 'GU',
		'NORTHERN MARIANA ISLANDS': 'MP',
		'PUERTO RICO': 'PR',
		'US VIRGIN ISLANDS': 'VI',

		// Also include two-letter codes mapping to themselves
		AL: 'ALABAMA',
		AK: 'ALASKA',
		AZ: 'ARIZONA',
		AR: 'ARKANSAS',
		CA: 'CALIFORNIA',
		CO: 'COLORADO',
		CT: 'CONNECTICUT',
		DE: 'DELAWARE',
		FL: 'FLORIDA',
		GA: 'GEORGIA',
		HI: 'HAWAII',
		ID: 'IDAHO',
		IL: 'ILLINOIS',
		IN: 'INDIANA',
		IA: 'IOWA',
		KS: 'KANSAS',
		KY: 'KENTUCKY',
		LA: 'LOUISIANA',
		ME: 'MAINE',
		MD: 'MARYLAND',
		MA: 'MASSACHUSETTS',
		MI: 'MICHIGAN',
		MN: 'MINNESOTA',
		MS: 'MISSISSIPPI',
		MO: 'MISSOURI',
		MT: 'MONTANA',
		NE: 'NEBRASKA',
		NV: 'NEVADA',
		NH: 'NEW HAMPSHIRE',
		NJ: 'NEW JERSEY',
		NM: 'NEW MEXICO',
		NY: 'NEW YORK',
		NC: 'NORTH CAROLINA',
		ND: 'NORTH DAKOTA',
		OH: 'OHIO',
		OK: 'OKLAHOMA',
		OR: 'OREGON',
		PA: 'PENNSYLVANIA',
		RI: 'RHODE ISLAND',
		SC: 'SOUTH CAROLINA',
		SD: 'SOUTH DAKOTA',
		TN: 'TENNESSEE',
		TX: 'TEXAS',
		UT: 'UTAH',
		VT: 'VERMONT',
		VA: 'VIRGINIA',
		WA: 'WASHINGTON',
		WV: 'WEST VIRGINIA',
		WI: 'WISCONSIN',
		WY: 'WYOMING',
		DC: 'DISTRICT OF COLUMBIA',
		AS: 'AMERICAN SAMOA',
		GU: 'GUAM',
		MP: 'NORTHERN MARIANA ISLANDS',
		PR: 'PUERTO RICO',
		VI: 'US VIRGIN ISLANDS',
	};

	//#endregion

	constructor(selector, update = null, complete = null, stateMapping = null) {
		if (stateMapping !== null) {
			this.#stateMapping = stateMapping;
		}

		this.#update = update;
		this.#complete = complete;

		this.#textarea = document.querySelector(selector);
		this.#textarea.addEventListener('keydown', (e) => this.#onKeydown(e));
	}

	//#region Formatting/Parsing Utils

	/**
	 * @param value string
	 * @returns {Date | string}
	 */
	#parseDate(value) {
		// Handle various date formats
		if (value.length === 8) {
			return new Date(
				Number(value.substring(4, 8)),
				Number(value.substring(0, 2)) - 1,
				Number(value.substring(2, 4))
			);
		}

		return value;
	}

	#formatState(value) {
		const stateValue = value.trim().toUpperCase();

		// Check if it's a valid 2-letter code
		if (stateValue.length === 2 && this.#stateMapping[stateValue]) {
			return stateValue;
		}

		// Check if it's a full state name
		if (this.#stateMapping[stateValue]) {
			return stateMapping[stateValue];
		}

		return value;
	}

	#formatGender(value) {
		const v = value.trim().toUpperCase();

		if (v === '1' || v === 'M' || v === 'MALE') {
			return 'M';
		}

		if (v === '2' || v === 'F' || v === 'FEMALE') {
			return 'F';
		}

		return v;
	}

	//#endregion

	#completed(data) {
		const text = this.#textarea.value;

		const ansiPattern = /@\s*[AÂ]NSI/i;
		const ansiMatch = text.substring(0,7).match(ansiPattern);

		if (!ansiMatch) {
			data = null;
			this.#complete(data);
		}

		this.#message = 'Success.';

		if (this.#update !== null) {
			this.#update(this.#message);
		}

		if (this.#complete !== null) {
			this.#complete(data);
		}
	}

	#parseLine(line) {
		const fieldKey = Object.keys(this.#dataFields).find((x) => line.startsWith(x));
		let value = line.replace(fieldKey, '');

		if (fieldKey === undefined) {
			return [null, null];
		}

		switch (fieldKey) {
			// case 'DAG': // Address
			// 	value = this.normalizeAddress(value);
			// 	break;
			case 'DAJ': // State
				value = this.#formatState(value);
				break;
			// case 'DAU': // Height
			// 	value = value.replace(/\s+in(?:ches)?$/i, '');
			// 	break;
			case 'DAW': // Weight
				value = value.replace(/\D/g, '');
				break;
			case 'DBB': // DOB
			case 'DBD': // Issue Date
			case 'DBA': // Expiration Date
				value = this.#parseDate(value);
				break;
			case 'DBC': // Gender
				value = this.#formatGender(value);
				break;
			case 'DAK': // Postal Code
				value = value.substring(0, 5);
				break;
			default:
				break;
		}

		return [this.#dataFields[fieldKey], value];
	}

	#scanningComplete() {
		// Parse values
		const lines = this.#textarea.value.split('\n').map((x) => x.trim());
		const data = {};

		for (const line of lines) {
			const [key, value] = this.#parseLine(line);

			if (key === null) {
				continue;
			}

			data[key] = value;
		}

		this.#completed(data);

	}

	#onKeydown(e) {
		e.preventDefault();
		this.#message = 'Processing...';

		const text = this.#textarea.value;

		if (this.#update !== null) {
			this.#update(this.#message);
		}

		clearTimeout(this.#timeout);
		this.#timeout = setTimeout(() => this.#scanningComplete(), 100);

		if (text.includes('DAQ') && !text.match(/\nDAQ/)) {
			const lastIndex = text.lastIndexOf('DAQ');
			const beforeDAQ = text.substring(0, lastIndex);
			const afterDAQ = text.substring(lastIndex);
			
			// Only add newline if the character before DAQ isn't already a newline
			if (beforeDAQ.length > 0 && beforeDAQ[beforeDAQ.length - 1] !== '\n') {
				this.#textarea.value = beforeDAQ + '\n' + afterDAQ;
			}
		}

		if (
			(e.key.toUpperCase() === 'J' && e.ctrlKey) ||
			e.key.toUpperCase() === 'ENTER'
		) {
			this.#textarea.value += '\n';
			return;
		}

		if (
			e.key === 'Shift' ||
			e.key === 'Control' ||
			e.key === 'Alt' ||
			e.ctrlKey
		) {
			return;
		}

		this.#textarea.value += e.key;
	}
}
