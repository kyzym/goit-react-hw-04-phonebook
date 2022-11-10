import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Box } from './utils/Box.styled';
import { FcContacts, FcList } from 'react-icons/fc';
import {
  Form,
  ContactsList,
  Filter,
  Title,
  SubTitle,
  ContactsNotification,
} from './AppComponentsMap';
import initialContacts from './data/contacts.json';

const LS_KEY = 'savedContacts';

export const App = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem(LS_KEY));
    if (savedContacts) {
      setContacts(savedContacts);
    }
  }, []);

  const addContact = ({ name, number }) => {
    if (contacts.some(contact => contact.name === name)) {
      return Notify.warning("Can't add already existing contact");
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };
    setContacts([newContact, ...contacts]);
  };

  const normalizedFilter = filter.toLowerCase().trim();

  const filteredContacts = contacts.filter(({ name }) =>
    name.toLowerCase().includes(normalizedFilter)
  );

  const changeFilter = e => {
    const { value } = e.target;
    setFilter(value);
  };

  const deleteContact = contactId => {
    setContacts(contacts => contacts.filter(({ id }) => id !== contactId));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={10}
      px={10}
    >
      <Title>
        Phonebook
        <FcContacts />
      </Title>
      <Form onSubmit={addContact} />

      <SubTitle>
        Contacts
        <FcList />
      </SubTitle>
      <Filter value={filter} onChange={changeFilter} />
      <ContactsList
        contacts={filteredContacts}
        onDeleteContact={deleteContact}
      />
      <ContactsNotification
        filtered={filteredContacts.length}
        contacts={contacts.length}
      />
    </Box>
  );
};
