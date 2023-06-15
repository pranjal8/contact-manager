import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import "./App.css";
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import api from "../api/contacts";
import EditContact from "./EditContact";

function App() {
  //const LOCAL_STORAGE_KEY = "contacts";
  // Retrive contacts from Local storage
  // const [contacts, setContacts] = useState(
  //   JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? []
  // );

  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(" ");
  const [searchResult, setSearchResult] = useState([]);

  //retrive contacts
  const retriveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  };

  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact,
    };
    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    console.log(response.data);
    const { id, name, email } = response.data;
    setContacts(
      contacts.map((item) => {
        return item.id === id ? { ...response.data } : contact;
      })
    );
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);

    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  //search  contact
  const searchHandler = (searchTerm) => {
    console.log(searchTerm);
    setSearchTerm(searchTerm);

    if (searchTerm !== "") {
      const newContactList = contacts.filter((item) => {
        console.log(Object.values(item));
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });

      setSearchResult(newContactList);
    } else {
      setSearchResult(contacts);
    }
  };

  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts);

    const getAllContacts = async () => {
      const allContacts = await retriveContacts();
      if (allContacts) {
        setContacts(allContacts);
      }
    };
    getAllContacts();
  }, []);

  useEffect(() => {
    //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className="ui container">
      {/* <Header />
      <AddContact addContactHandler={addContactHandler} />
      <ContactList contacts={contacts} getContactId={removeContactHandler} /> */}

      <BrowserRouter>
        <Header />
        <Routes>
          {/* Get contact */}
          <Route
            path="/"
            exact
            Component={() => (
              <ContactList
                //contacts={searchTerm.length <1 ? contacts : searchResult}
                 term={searchTerm}
                searchKeyword={searchHandler}
                contacts={contacts}
                getContactId={removeContactHandler}
               
              />
            )}
            // render={(props) => (
            //   <ContactList
            //     {...props}
            //     contacts={contacts}
            //     getContactId={removeContactHandler}
            //   />
            // )}
          />

          {/* Add contact */}
          <Route
            path="/add"
            exact
            Component={() => (
              <AddContact addContactHandler={addContactHandler} />
            )}
            // render={(props) => (
            //   <AddContact {...props} addContactHandler={addContactHandler} />
            // )}
          />

          <Route path="/contact/:id" exact Component={ContactDetail} />

          {/* Update contact */}
          <Route
            path="/edit"
            exact
            Component={() => (
              <EditContact updateContactHandler={updateContactHandler} />
            )}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
