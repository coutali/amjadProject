// Retrieve privileges from local storage
const privileges = JSON.parse(localStorage.getItem('privileges'))

// Access the results, privileges, and actions
const results = privileges.results
const privilegesList = privileges.privileges
const actions = privileges.actions

// Use the retrieved data as needed
console.log('Results:', results)
console.log('Privileges:', privilegesList)
console.log('Actions:', actions)
