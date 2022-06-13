import { test, expect } from 'vitest'
import { databaseClient } from './implementation'

// Login tests
test('The user should contain email after a successful login', async () => {
  await databaseClient.login('fdx91776@jeoce.com', '123456789')
  expect(databaseClient.user.value?.email).toBe('fdx91776@jeoce.com')
})

test('The user should contain email after a successful login', async () => {
  await databaseClient.login('fdx91776@jeoce.com', '123456789')
  expect(databaseClient.user.value?.uuid).toBe(
    '5bd2ae37-7972-46e4-8bac-1f2c7248f622',
  )
})

// Registring tests
test('The username must have a minimal length of 3 characters', async () => {
  const { error } = await databaseClient.signIn(
    (Math.random() + 1).toString(8).substring(2) + '@email.com',
    '123456789',
    Math.random().toString(36).slice(2, 4),
  )
  expect(error).toBe("Nom d'utilisateur trop court")
})
