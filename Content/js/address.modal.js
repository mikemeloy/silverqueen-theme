let validation = {
    streetRequired: false,
    cityRequired: false,
    zipRequired: false,
    phoneRequired: false
};

const
    btnUseSecondaryAddress = document.querySelector('[data-open-other]'),
    chxUseSecondaryAddress = document.getElementById('UseSecondaryAddress'),
    btnNewAddress = document.querySelector('[data-open-new]'),
    newAddressDialog = document.querySelector('dialog[data-new-address]'),
    btnSubmitAddress = document.querySelector('[data-billing-address-submit]'),
    btnCloseSecondaryAddress = document.querySelector('[data-shipping-address] i'),
    isBillingAddressValid = () => {
        const isValid = window.validatePrimaryAddress?.();

        return isValid;
    },
    markShippingAddress = (id) => {
        const addressEls = document.querySelectorAll(`[data-addressid]`);

        addressEls.forEach(el => {
            const addressId = el.dataset.addressid,
                isShippingAddress = addressId === id

            el.setAttribute('data-shipping', `${isShippingAddress}`);
        });
    },
    onUserSelectNewAddress = (id) => {
        const el = document.getElementById('existingprimaryaddresses'),
            changeEvent = new Event('change');

        if (!!el) {
            el.value = id;
            el.dispatchEvent(changeEvent);
        }

        markShippingAddress(id);
    },
    onUserAddNewOrEditAddress_Click = (id = 0) => {
        onUserSelectNewAddress(id);
        newAddressDialog.showModal();
    },
    onUserSubmitAddress_Click = async () => {
        const address = window.getPrimaryAddress?.() ?? {},
            stateProvince = +address.StateProvinceId;

        if (!isBillingAddressValid() || stateProvince === 0) {
            alert('Please make sure all required fields have a value');
            return;
        }

        const fieldSet = document.querySelector(`[data-addressid="${address.Id}"]`),
            street = fieldSet.querySelector('[data-street]'),
            city = fieldSet.querySelector('[data-city]'),
            zip = fieldSet.querySelector('[data-zip]'),
            edit = fieldSet.querySelector('i');

        street.innerText = address.Address1;
        city.innerText = address.City;
        zip.innerText = address.ZipPostalCode;
        edit.innerText = "Edit";

        try {
            await window.adjustChangeAddressMethod?.(1);
            closeAddressModal();
        } catch (error) {
            console.error(error);
            alert('Unable to Save Address');
        }
    },
    getPrimaryAddressId = () => {
        const primaryAddressId = document.getElementById('PrimaryAddress_Id');
        return primaryAddressId?.value ?? '0';
    },
    addEventListeners = () => {
        btnUseSecondaryAddress.addEventListener('click', () => chxUseSecondaryAddress.click());
        btnNewAddress?.addEventListener('click', onUserAddNewOrEditAddress_Click);
        btnSubmitAddress.addEventListener('click', onUserSubmitAddress_Click);
        btnCloseSecondaryAddress.addEventListener('click', () => chxUseSecondaryAddress.click());
    },
    closeAddressModal = () => newAddressDialog.close();

addEventListeners();
markShippingAddress(getPrimaryAddressId());


