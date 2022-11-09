import { Component } from 'react';
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

export class App extends Component {
  state = {
    contacts: initialContacts,
    filter: '',
  };

  componentDidMount() {
    const savedContacts = JSON.parse(localStorage.getItem(LS_KEY));

    if (savedContacts) {
      this.setState({ contacts: savedContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem(LS_KEY, JSON.stringify(this.state.contacts));
    }
  }

  deleteContact = contactId => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(({ id }) => id !== contactId),
    }));
  };

  addContact = ({ name, number }) => {
    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    if (this.state.contacts.some(contact => contact.name === name)) {
      return Notify.warning("Can't add already existing contact");
    }

    this.setState(({ contacts }) => ({ contacts: [newContact, ...contacts] }));
  };

  changeFilter = e => {
    const { value } = e.target;

    this.setState({ filter: value });
  };

  render() {
    const { contacts, filter } = this.state;
    const { deleteContact, addContact, changeFilter } = this;

    const normalizedFilter = filter.toLowerCase().trim();

    const filteredContacts = contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );

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
  }
}
