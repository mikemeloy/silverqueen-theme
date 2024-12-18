const
    outTheDoorPrice = document.querySelector('.outthedoorprice-widget-container'),
    btnUseSecondaryAddress = document.querySelector('[data-open-other]'),
    chxUseSecondaryAddress = document.getElementById('UseSecondaryAddress'),
    newAddressDialog = document.querySelector('dialog[data-new-address]'),
    btnSubmitAddress = document.querySelector('[data-billing-address-submit]'),
    btnCloseSecondaryAddress = document.querySelector('[data-shipping-address] i'),
    primaryHeader = document.querySelector('[data-primary-header]'),
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
        const primaryAddressDdl = document.getElementById('existingprimaryaddresses'),
            syntheticEvent = new Event('change'),
            primaryAddress = window.getPrimaryAddress?.();

        if (!primaryAddressDdl) {
            return;
        }

        if (primaryAddress.Id === id) {
            console.log('clicked same address');
            return;
        }

        primaryAddressDdl.value = id;
        primaryAddressDdl.dispatchEvent(syntheticEvent);

        markShippingAddress(id);
    },
    onUserAddNewOrEditAddress_Click = (addressId) => {
        onUserSelectNewAddress(addressId);
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
    onOutTheDoorPriceSuccess = ({ detail }) => {
        console.dir(detail);
        window.adjustOrderSummary?.();
    },
    addEventListeners = () => {
        btnUseSecondaryAddress.addEventListener('click', () => chxUseSecondaryAddress.click());
        btnSubmitAddress.addEventListener('click', onUserSubmitAddress_Click);
        btnCloseSecondaryAddress.addEventListener('click', () => chxUseSecondaryAddress.click());
        outTheDoorPrice.addEventListener('otdapplied', onOutTheDoorPriceSuccess);
    },
    setupObserver = () => {
        const
            options = {
                root: document.querySelector(".simple-checkout-data-left"),
                rootMargin: "0px",
                threshold: 1.0,
            },
            onVisibilityChange = ([{ isIntersecting }]) => {
                const lbl = isIntersecting ? "Billing Address" :"Billing / Shipping Address";
                primaryHeader.innerHTML = lbl;
            },
            observer = new IntersectionObserver(onVisibilityChange, options);

        observer.observe(btnCloseSecondaryAddress);
    },
    closeAddressModal = () => newAddressDialog.close();

addEventListeners();
markShippingAddress(getPrimaryAddressId());
setupObserver();