import DriversLicenseParser from '/Themes/SilverQueen-2023/Content/js/DriversLicenseParser.js';
import { mappings } from '/Themes/SilverQueen-2023/Content/js/licenseParserMappings.js';

class Scanner {
    constructor() {
        this.scannerInput = document.getElementById('scannerInput');
        this.scanStatus = document.getElementById('scanStatus');
        this.dialog = document.getElementById('scannerDialog');
        this.spinner = document.querySelector('.spinner');

        this.initializeParser();
        this.dialogControls();
    }

    initializeParser() {
        this.parser = new DriversLicenseParser(
            '#scannerInput',
            (message) => this.updateStatus(message),
            (data) => this.handleScanComplete(data)
        );
    }

    dialogControls() {
        const openButton = document.getElementById('scannerDialogOpen');
        const closeButtons = document.querySelectorAll('.scannerDialogClose');

        openButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openDialog();
        });

        closeButtons.forEach(button => {
            button?.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDialog();
            });
        });
    }

    resetScanner() {
        scannerInput.value = '';
        scannerInput.focus();
        this.updateStatus('Waiting for Scan...');
        this.spinner.classList.add('hidden-spinner');
    }

    updateStatus(message) {
        this.scanStatus.textContent = message;
        this.spinner.classList.remove('hidden-spinner');
    }

    handleScanComplete(data) {
        try {
            if (!data) {
                throw Error;
            } else {
                this.mapDataToFields(data);
            }

            this.spinner.classList.add('hidden-spinner');
            setTimeout(() => {
                this.closeDialog()
                this.spinner.classList.remove('hidden-spinner');
            }, 1000);

        } catch (error) {
            console.error('Error handling scan completion:', error);
            this.updateStatus('Error processing.');
            setTimeout(() => {
                this.resetScanner();
            }, 700)
        }
    }

    setFieldValue(selector, value) {
        const element = document.getElementById(selector);
        if (!element) {
            console.error(`Field with the selector of ${selector} not found`);
            return;
        }
        element.value = value;
    }

    mapDriverLicenseNumber(data) {
        const xPath = `//label[contains(text(),'Driver')]/following::input[1]`,
            txtDriverLicense = document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue;

        this.setFieldValue(txtDriverLicense?.id, data.license_number ?? '');
    }

    mapDataToFields(data) {
        this.mapDriverLicenseNumber(data);
        // This is being called from _CheckoutAttributes to ensure that the license_number is run first
        window.checkoutAttributeChange?.();

        try {
            Object.entries(data).forEach(([fieldName, value]) => {
                const elementId = mappings.simpleCheckoutFieldToElementMap[fieldName];
                if (!elementId) return;

                const element = document.getElementById(elementId);
                if (!element) return;

                if (elementId === 'PrimaryAddress_CountryId') {
                    setTimeout(() => {
                        this.handleCountrySelection(element, data);

                    }, 100)
                } else {
                    setTimeout(() => {
                        element.value = value;
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                    }, 100)
                }
            });
        } catch (error) {
            console.error('Error mapping data to fields:', error);
            throw error;

        }
    }

    handleCountrySelection(countrySelect, data) {
        countrySelect.options[1].selected = true;
        countrySelect.dispatchEvent(new Event('change', { bubbles: true }));

        if (data.state) {
            setTimeout(() => this.handleStateSelection(data.state), 1000);
        }
    }

    handleStateSelection(stateCode) {
        const stateSelect = document.getElementById('PrimaryAddress_StateProvinceId');
        if (!stateSelect) return;

        // Find full state name from abbreviation
        const fullStateName = Object.keys(mappings.stateMapping)
            .find(name => mappings.stateMapping[name] === stateCode.toUpperCase());

        // Find and select the matching state option
        const stateOption = Array.from(stateSelect.options)
            .find(option => option.textContent.trim().toUpperCase() === fullStateName);

        if (stateOption) {
            stateSelect.value = stateOption.value;
            stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    openDialog() {
        if (!this.spinner.classList.contains('hidden-spinner')) {
            this.spinner.classList.add('hidden-spinner');
        }
        this.dialog.showModal();
        this.scannerInput?.focus();
        this.scannerInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.scannerInput.focus();
            }, 0);
        });
    }

    closeDialog() {
        this.dialog.close();
        this.resetScanner();
        this.scannerInput.removeEventListener('blur', () => {
            setTimeout(() => {
                this.scannerInput.focus();
            }, 0);
        });
    }
}

export { Scanner as default }