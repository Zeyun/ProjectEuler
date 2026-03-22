window.ATLib = window.ATLib || {};

Object.assign(window.ATLib, {
    sleep: async (seconds) => {
        return new Promise((resolve) => {
            let remaining = seconds;

            const interval = setInterval(() => {
                console.log(`Time remaining: ${remaining}s`);
                remaining--;

                if (remaining < 0) {
                    clearInterval(interval);
                    console.log("Timer finished!");
                    resolve();
                }
            }, 1000);
        });
    },

    waitForElement: async ({selector, state = 'visible', timeout = 120*1000 }) => {
            // Normalize to array of descriptor objects
            // Each entry can be:
            //   - a string: { selector: '...', shadow: false }
            //   - an object: { selector: '...', shadow: '...' }
            const selectorList = (Array.isArray(selector) ? selector : [selector]).map(entry =>
                typeof entry === 'string' ? { selector: entry, shadow: false } : entry
            );
            return new Promise((resolve, reject) => {
                const check = () => {
                    for (const { selector, shadow } of selectorList) {
                        const el = document.querySelector(selector);

                        if (state === 'visible') {
                            const match = shadow ? el?.shadowRoot?.querySelector(shadow) : el;
                            if (match) return match;
                        } else {
                            // 'hidden': resolve as soon as ALL selectors are gone,
                            // or change to `!el` if any-one-gone semantics is preferred
                            if (!el) return true;
                        }
                    }
                    return null;
                };

                // 1. Immediate check
                const result = check();
                if (result) return resolve(result);

                // 2. Watch for DOM mutations
                const observer = new MutationObserver(() => {
                    const result = check();
                    if (result) {
                        clearTimeout(timer);
                        observer.disconnect();
                        resolve(result);
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                const timer = setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(
                        `Timeout: None of [${selectorList.map(e => e.selector + (e.shadow ? ` > ${e.shadow}` : '')).join(', ')}] became ${state} within ${timeout}ms`
                    ));
                }, timeout);
            });
        },

    getBusinessDate: (
        daysFromNow,
        dateFormat={
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
            }) =>
    {
        const date = new Date();
        // 1. Add the days to the current date
        date.setDate(date.getDate() + daysFromNow);
        const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
        // 2. Adjust if it falls on a weekend
        if (dayOfWeek === 0) {
            // It's Sunday, go back 2 days to Friday
            date.setDate(date.getDate() - 2);
        } else if (dayOfWeek === 6) {
            // It's Saturday, go back 1 day to Friday
            date.setDate(date.getDate() - 1);
        }
        return date.toLocaleDateString('en-US',dateFormat)
    },

    checkForFreshPage: async (minutes) => {
        const now = Date.now(); // Current time in milliseconds
        const lastVisit = localStorage.getItem("at_last_load_timestamp");
        // Convert minutes to milliseconds: minutes * 60 seconds * 1000ms
        const cooldownPeriod = minutes * 60 * 1000;

        if (lastVisit) {
            const timePassed = now - parseInt(lastVisit);

            if (timePassed > cooldownPeriod) {
                // It hasn't been N minutes yet!
                const remaining = Math.round((timePassed) / 1000 / 60);
                console.log(`Refreshing. ${remaining} minutes passed`);
                await this.sleep(5)
                //window.location.href = redirectUrl;
                window.location.reload()
                return null; // Stop execution
            } else {
                console.log("new page, no reload")}
        }
    },
    testVariable: 123,
    testFunctionAt: ()=>{
        console.log(this.testVariable);
        this.testVariable = this.testVariable + 1
        console.log(this.testVariable)
    }
});

// sleep = async (seconds) => {
//     return new Promise((resolve) => {
//         let remaining = seconds;
//
//         const interval = setInterval(() => {
//             console.log(`Time remaining: ${remaining}s`);
//             remaining--;
//
//             if (remaining < 0) {
//                 clearInterval(interval);
//                 console.log("Timer finished!");
//                 resolve();
//             }
//         }, 1000);
//     });
// }


// await ATLib.sleep(10);