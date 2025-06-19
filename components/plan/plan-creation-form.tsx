"use client"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

interface PlanCreationFormProps {
  onSubmit: (values: PlanCreationFormValues) => void
}

interface PlanCreationFormValues {
  planCode: string
  planName: string
  description: string
}

export function PlanCreationForm({ onSubmit }: PlanCreationFormProps) {
  const initialValues: PlanCreationFormValues = {
    planCode: "",
    planName: "",
    description: "",
  }

  const validationSchema = Yup.object().shape({
    planCode: Yup.string()
      .required("Plan Code is required")
      .min(3, "Plan Code must be at least 3 characters")
      .max(20, "Plan Code must be less than 20 characters"),
    planName: Yup.string()
      .required("Plan Name is required")
      .min(3, "Plan Name must be at least 3 characters")
      .max(50, "Plan Name must be less than 50 characters"),
    description: Yup.string().max(200, "Description must be less than 200 characters"),
  })

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="planCode">Plan Code</label>
            <Field type="text" id="planCode" name="planCode" placeholder="Enter Plan Code" />
            <ErrorMessage name="planCode" component="div" style={{ color: "red" }} />
            <small>Unique identifier for the plan.</small>
          </div>

          <div>
            <label htmlFor="planName">Plan Name</label>
            <Field type="text" id="planName" name="planName" placeholder="Enter Plan Name" />
            <ErrorMessage name="planName" component="div" style={{ color: "red" }} />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Field as="textarea" id="description" name="description" placeholder="Enter Description" />
            <ErrorMessage name="description" component="div" style={{ color: "red" }} />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Plan"}
          </button>
        </Form>
      )}
    </Formik>
  )
}
