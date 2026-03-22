window.ATDates = window.ATDates || {};

Object.assign(window.ATDates, {
    getUpcomingFriday: ()=> {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
        const targetDay = 5; // Friday

        // Calculate days until Friday
        // (7 + target - current) % 7 gives days until next Friday
        // If today is Friday, this returns 0. If you want NEXT week's Friday, use || 7.
        let daysUntilFriday = (targetDay - dayOfWeek + 7) % 7;

        // If you want the *next* Friday (not today), even if today is Friday:
        if (daysUntilFriday === 0) daysUntilFriday = 7;

        const upcomingFriday = new Date(today);
        upcomingFriday.setDate(today.getDate() + daysUntilFriday);
        return upcomingFriday.toLocaleDateString('en-US',dateFormat);
        // Example Output: "Fri Feb 20 2026"
    }

});

function getNextWeekday(date = new Date()) {
    const day = date.getDay();
    const addDays = (day === 5) ? 3 : (day === 6) ? 2 : 1;

    const next = new Date(date);
    next.setDate(date.getDate() + addDays);
    return next.toLocaleDateString('en-US',dateFormat);
}

const getUpcomingFriday = ()=> {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const targetDay = 5; // Friday

    // Calculate days until Friday
    // (7 + target - current) % 7 gives days until next Friday
    // If today is Friday, this returns 0. If you want NEXT week's Friday, use || 7.
    let daysUntilFriday = (targetDay - dayOfWeek + 7) % 7;

    // If you want the *next* Friday (not today), even if today is Friday:
    if (daysUntilFriday === 0) daysUntilFriday = 7;

    const upcomingFriday = new Date(today);
    upcomingFriday.setDate(today.getDate() + daysUntilFriday);
    return upcomingFriday.toLocaleDateString('en-US',dateFormat);
    // Example Output: "Fri Feb 20 2026"
}
