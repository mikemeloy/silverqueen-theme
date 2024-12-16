const
    btnUseSecondaryAddress = document.querySelector('[data-open-other]'),
    chxUseSecondaryAddress = document.getElementById('UseSecondaryAddress'),
    btnNewAddress = document.querySelector('[data-open-new]'),
    newAddressDialog = document.querySelector('dialog[data-new-address]'),
    btnSubmitAddress = document.querySelector('[data-billing-address-submit]'),
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
    onCheckBox_Change = ({ target }) => {
        const unChecked = "Select an Alternative Shipping Address",
            checked = "Use Same Address for Shipping and Billing";
        btnUseSecondaryAddress.innerHTML = target.checked ? checked : unChecked;
    },
    onUserSubmitAddress_Click = async () => {
        const address = window.getPrimaryAddress?.() ?? {},
            fieldSet = document.querySelector(`[data-addressid="${address.Id}"]`),
            street = fieldSet.querySelector('[data-street]'),
            city = fieldSet.querySelector('[data-city]'),
            zip = fieldSet.querySelector('[data-zip]');

        street.innerText = address.Address1;
        city.innerText = address.City;
        zip.innerText = address.ZipPostalCode;

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
        chxUseSecondaryAddress.addEventListener('change', onCheckBox_Change);
        chxUseSecondaryAddress.addEventListener('cancel', onCheckBox_Change);
    },
    closeAddressModal = () => newAddressDialog.close();

addEventListeners();
markShippingAddress(getPrimaryAddressId());
