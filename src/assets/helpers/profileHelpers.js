export const generateHighlightedElementProperties = (buttonAddUser, firstUserProfileCard, secondUserProfileCard, searchButton) => {
    return {
        buttonAddUser: {
            disabled: false,
            highlight: '',
            ref:  buttonAddUser,
        },
        firstUserProfileCard: {
            disabled: false,
            highlight: '',
            ref: firstUserProfileCard,
        },
        secondUserProfileCard: {
            disabled: false,
            highlight: '',
            ref: secondUserProfileCard,
        },
        searchButton: {
            disabled: false,
            highlight: '',
            ref: searchButton,
        },
    }
}