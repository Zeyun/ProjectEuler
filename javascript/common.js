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