export interface Person {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
  phone: string
  email: string
  gender: string
  occupation: string
  allergiesType?: string[]
  allergies?: string
  smoker?: boolean
  alcoholConsumption?: boolean
}
