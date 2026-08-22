export const suggestFollowUpReminder = async (contactName, contactDate, companyName, addReminder) => {
    if (!contactDate) return;

    // Add 7 days to the last contacted date
    const date = new Date(contactDate);
    date.setDate(date.getDate() + 7);

    // Check if the automatically suggested date is already in the past
    if (date < new Date()) {
        // Fallback: If 7 days after contact is in the past, just suggest tomorrow
        date.setTime(new Date().getTime() + 24 * 60 * 60 * 1000);
    }

    // Format to YYYY-MM-DD
    const dueDate = date.toISOString().split('T')[0];

    const title = `Follow up with ${contactName} from ${companyName || 'the company'}`;

    try {
        await addReminder({
            title,
            remind_at: dueDate,
            type: 'follow_up'
        });
        return true;
    } catch (e) {
        console.error("Failed to auto-create follow-up reminder", e);
        return false;
    }
};
