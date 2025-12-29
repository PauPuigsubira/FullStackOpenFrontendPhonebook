import { useState, useEffect } from 'react'
import servicesPersons from './services/persons'

import './styles/phonebook.css'

const Filter = ({title, handleFilter, filter, itemsFiltered}) => {
  return (
    <>
      <label>{title}</label>
        <input
          style={{color: itemsFiltered === 0 ? 'red':''}}
          placeholder='Find by contact name'
          onChange={handleFilter}
          value={filter}
        />
    </>
  )
}

const NewContact = (
  {handleSubmit,handleInputChange,inputName,handleNumberChange,inputNumber}
) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <label htmlFor='phonebookName'>name:</label>
          <input
            id='phonebookName'
            placeholder='new contact...'
            onChange={handleInputChange}
            value={inputName}
          />
        </section>
        <section>
          <label htmlFor='phonebookNumber'>number:</label>
          <input
            id='phonebookNumber'
            placeholder='040-123456'
            onChange={handleNumberChange}
            value={inputNumber}
          />
        </section>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Person = ({person, handleClick }) => {
  return (
    <li>
      {person.name} {person.number} 
      <button onClick={handleClick}>Delete</button>
    </li>
  )
}

const DisplayContacts = ({personList, deleteItem}) => {
  return (
    <ul>
      {
        personList.map((person) => {
          return (
            <Person
              key={person.id}
              person={person}
              handleClick={()=>deleteItem(person.id)}
            />
          )
        })
      }
    </ul>
  )
}

const Notification = ({message, styleMessage}) => {

  if (message === null) {
    return null
  }

  return (
    <div className={styleMessage}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [personsFiltered, setPersonsFiltered] = useState([])
  const [userMessage, setUserMessage] = useState(null)
  const [styleMessage, setStyleMessage] = useState('notification')

  const showMessage = (message, styleMessage) => {
    console.log(message,styleMessage)
    setUserMessage(message)
    setStyleMessage(styleMessage)
    
    setTimeout(()=>{ 
      setUserMessage(null)
    }, 5000)
  }

  const getPersons = () => {
    servicesPersons
      .get()
      .then((data) => {
        setPersons(data)
      })
  }

  const handleFilter = (e) => {
    const filter = e.target.value
    const personsFiltered = persons.filter(
      person => person.name.toLowerCase().includes(filter)
    )

    setNewFilter(filter)

    if (personsFiltered.length > 0) {
      setPersonsFiltered(personsFiltered)
    } else {
      setPersonsFiltered([])
    }
  }

  const handleInputChange = (e) => {
    const newName = e.target.value
    setNewName(newName)
  }

  const handleNumberChange = (e) => {
    const regExp = /[^0-9-]/g
    const num = e.target.value

    if (regExp.test(num)) return
  
    setNewNumber(num)
  }

  const handleSubmit = (e) => {
    console.log('handleSubmit called')  
    let message = null
    let style = 'notification'

    e.preventDefault()
    if (newName === '') return
    if (newNumber === '') return
  
    const newPerson = {
      name: newName,
      number: newNumber
    }
    console.log('newPerson',newPerson)
    servicesPersons
      .add(newPerson)
      .then((response) => {
        const {status, data} = response
        console.log('add person response', response,'status', status, 'data', data )

        if (status === 201) {
          message = `Added new contact ${newPerson.name}`
        }

        if (status === 206) {
          message = `Updated contact ${newPerson.name}`
        }

        if (status === 201 || status === 206) {
          getPersons()
        } else {
          style = 'error'
          message = data.error
          console.log('error message',message)
/*
          if (status === 409) {
            message = `A contact with this number already exist: ${newNumber}`
            console.log('error',status,message)
  
          } else {
            message=`An error occurred at adding person ${newPerson.name}. Status ${status}`
            console.log('error',status,message)
          }
*/
        }
        showMessage(message, style)  
      })

    console.log('after servicesPersons.add')


/*
    if (!persons.find(person => person.name === newName)) {
      servicesPersons
        .add(newPerson)
        .then(data => {
          setPersons(persons.concat(data))

          if (
            personsFiltered.length &&
            newName.toLowerCase().includes(newFilter)
          ) {
            setPersonsFiltered(personsFiltered.concat(data))
          }

          message = `Added new contact ${data.name}`
          showMessage(message, style)
        })
        .catch(error => {
          message = `No se ha podido agregar la nueva person por error ${error.status}`
          style = 'error'
          alert(message)
          showMessage(message, style)
        })

    } else {
        const existingContact = persons.find(person => person.name === newName)

        if (
          window.confirm(`This is a new number for ${existingContact.name}. Do you want to replace ${existingContact.number} with this one (${newNumber})?`)
        ) {
          const updatedPerson = {...existingContact, number: newNumber}

          servicesPersons
            .update(updatedPerson)
            .then(data => {
              const newPersons = persons.map(person => person.id !== data.id ? person : data)
              setPersons(newPersons)

              message = `Edited contact ${existingContact.name} with the number ${newNumber}`
              style = 'notification'
              showMessage(message, style)              
            })

        } else {
          message = `${newName} is already added to phonebook`
          style = 'error'
          console.log(message)
          showMessage(message, style)              
        }
    }
*/
    setNewName('')
    setNewNumber('')
  }
  // Get Data from server
  useEffect(getPersons,[])

  const deleteItem = (id) => {
    let message = null
    let style = 'notification'

    if (!window.confirm(`Do you really want to delete the item with the id ${id}`)) {
      return
    }

    servicesPersons
      .remove(id)
      .then(status => {
        if (status === 204) {
          message = `Deleting contact with id ${id}`
          showMessage(message, style)
          
          const newPersons = persons.filter(person => person.id !== id)
          setPersons(newPersons)
        } else {
          message=`An error occurred at deleting person with id ${id}. Status ${status}`
          style='error'
          showMessage(message, style)

          if (status === 404) {
            const newPersons = persons.filter(person => person.id !== id)
            setPersons(newPersons)
          }
        }
      })
      .catch(error => {
        message=`An error occurred at deleting person with id ${id}. Status ${error.status}`
        style='error'
        showMessage(message, style)

        if (error.status === 404) {
          const newPersons = persons.filter(person => person.id !== id)
          setPersons(newPersons)
        }
      })
  }

  return (
    <div style={{color: 'white',marginTop:'100px'}}>
      <h2>Phonebook</h2>
      <Notification
        message={userMessage}
        styleMessage={styleMessage}
      />
      <div>
        <h3>Find</h3>
        <Filter
          title={'Filter shown with...'}
          handleFilter={handleFilter}
          filter={newFilter}
          itemsFiltered={personsFiltered.length}
        />
      </div>
      <h3>Add New</h3>
      <NewContact
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        inputName={newName}
        handleNumberChange={handleNumberChange}
        inputNumber={newNumber}
      />
      <h3>Numbers</h3>
      <DisplayContacts
        personList={personsFiltered.length > 0 ? personsFiltered : persons}
        deleteItem={deleteItem}
      />
    </div>
  )
}

export default App