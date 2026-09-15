import { useFormik, type FormikErrors } from 'formik'
import { z } from 'zod'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/TextArea'
import { trpc } from '../../lib/trpc'

const ideaSchema = z.object({
  name: z.string().min(1),
  nick: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Nick may contain only lowercase letters, numbers and dashes'),
  description: z.string().min(1),
  text: z.string().min(100, 'Text should be at least 100 characters long'),
})

type IdeaFormValues = z.infer<typeof ideaSchema>

const validateIdea = (values: IdeaFormValues): FormikErrors<IdeaFormValues> => {
  const result = ideaSchema.safeParse(values)

  if (result.success) {
    return {}
  }

  return result.error.issues.reduce<FormikErrors<IdeaFormValues>>((errors, issue) => {
    const field = issue.path[0]

    if (typeof field === 'string' && field in values) {
      errors[field as keyof IdeaFormValues] = issue.message
    }

    return errors
  }, {})
}

export const NewIdeaPage = () => {
  const createIdea = (trpc as any).createIdea.useMutation()
  const formik = useFormik<IdeaFormValues>({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    onSubmit: async (values) => {
      await createIdea.mutateAsync(values)
    },
    validate: validateIdea,
  })

  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <Input name="name" label="Name" formik={formik} />
        <Input name="nick" label="Nick" formik={formik} />
        <Input name="description" label="Description" formik={formik} />
        <Textarea name="text" label="Text" formik={formik} />
        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Some fields are invalid</div>}
        <button type="submit">Create Idea</button>
      </form>
    </Segment>
  )
}
