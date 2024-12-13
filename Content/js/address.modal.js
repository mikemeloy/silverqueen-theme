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

        el.value = `${id}`;
        el.dispatchEvent(changeEvent);

        markShippingAddress(id);
    },
    onUserAddNewOrEditAddress_Click = (id = 0) => {
        onUserSelectNewAddress(id);
        newAddressDialog.showModal();
    },
    onUserSubmitAddress_Click = async () => {
        await window.adjustChangeAddressMethod?.(1);

        closeAddressModal();
    },
    getPrimaryAddressId = () => {
        const primaryAddressId = document.getElementById('PrimaryAddress_Id');
        return primaryAddressId?.value ?? '0';
    },
    closeAddressModal = () => newAddressDialog.close();

markShippingAddress(getPrimaryAddressId());
btnUseSecondaryAddress.addEventListener('click', () => chxUseSecondaryAddress.click());
btnNewAddress.addEventListener('click', onUserAddNewOrEditAddress_Click);
btnSubmitAddress.addEventListener('click', onUserSubmitAddress_Click);