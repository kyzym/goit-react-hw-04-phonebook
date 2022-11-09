export const ContactsNotification = ({
  filtered: filteredContacts,
  contacts,
}) => (
  <div>
    {filteredContacts !== contacts ? (
      <span>Found contacts: {filteredContacts}</span>
    ) : (
      <span>Total number of contacts: {contacts}</span>
    )}
  </div>
);
