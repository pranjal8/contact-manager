import React, { useRef } from "react";
import ContactCard from "./ContactCard";
import { Link } from "react-router-dom";

const ContactList = (props) => {
  console.log("props", props);
  const inputElement = useRef("");

  const deleteConactHandler = (id) => {
    props.getContactId(id);
  };

  //search term
  const getSearchTerm = (e) => {
    console.log(inputElement.current)
    props.searchKeyword(inputElement.current)
   
    
  };

  const renderContactList = props.contacts.map((contact) => {
    return (
      <ContactCard
        contact={contact}
        clickHander={deleteConactHandler}
        key={contact.id}
      />
    );
  });
  return (
    <div className="main">
      <h2>
        Contact List
        <Link to="/add">
          {" "}
          <button className="ui button blue right">Add Contact</button>{" "}
        </Link>
      </h2>

      {/* Search contact */}
      <div className="ui search">
        <div className="ui icon input">
          <input
            ref={inputElement}
            value={props.term}
            onChange={getSearchTerm}
            type="text"
            placeholder="search contact"
            className="prompt"
          />
          <i className="search icon"></i>
        </div>
      </div>

{/* List */}
      <div className="ui celled list">{renderContactList}</div>
    </div>
  );
};

export default ContactList;
