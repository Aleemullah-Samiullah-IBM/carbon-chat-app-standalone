import React, {useState, useEffect} from 'react'
import {
  Form,
  Modal,
  InlineNotification,
  PasswordInput,
  TextInput,
} from '@carbon/react'

import './McpAuthModal.scss'

interface AuthField {
  name: string
  label: string
  input: 'text' | 'password'
  required: boolean
}

interface McpAuthModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (credentials: Record<string, string>) => void
  authFields: AuthField[]
  serverName: string
}

export const McpAuthModal = ({
  open,
  onClose,
  onSubmit,
  authFields,
  serverName,
}: McpAuthModalProps): JSX.Element => {
  const [creds, setCreds] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showError, setShowError] = useState(false)

  // no credentials needed - proceed
  const isNoAuth = authFields.length === 0

  useEffect(() => {
    if (open) {
      const initialCreds: Record<string, string> = {}
      authFields.forEach(field => {
        initialCreds[field.name] = ''
      })
      setCreds(initialCreds)
      setErrors({})
      setShowError(false)
    }
  }, [open, authFields])

  const handleInputChange = (fieldName: string, value: string) => {
    setCreds(prev => ({
      ...prev,
      [fieldName]: value,
    }))

    // clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[fieldName]
        return newErrors
      })
    }
    setShowError(false)
  }

  const validateForm = (): boolean => {
    if (isNoAuth) return true

    const newErrors: Record<string, string> = {}
    let isValid = true

    authFields.forEach(field => {
      const value = creds[field.name]
      if (field.required && (!value || value.trim() === '')) {
        newErrors[field.name] = `${field.label} is required`
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = () => {
    if (isNoAuth) {
      onSubmit({})
      onClose()
    } else if (validateForm()) {
      onSubmit(creds)
      onClose()
    } else {
      setShowError(true)
    }
  }

  const handleCancel = () => {
    setCreds({})
    setErrors({})
    setShowError(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onRequestClose={handleCancel}
      modalHeading={`MCP Server Authentication: ${serverName}`}
      modalLabel='Credentials Required'
      primaryButtonText={isNoAuth ? 'Continue' : 'Submit'}
      onRequestSubmit={handleSubmit}
      // secondaryButtonText='Cancel'
      // onSecondarySubmit={handleCancel}
      preventCloseOnClickOutside
      size='sm'
    >
      <div className='mcp-auth-modal'>
        {showError && Object.keys(errors).length > 0 && (
          <InlineNotification
            kind='error'
            title='Validation Error'
            subtitle='Please fill in all required fields'
            lowContrast
            hideCloseButton
          />
        )}

        {isNoAuth ? (
          <p>
            This MCP server does not require authentication. Click Continue to
            proceed.
          </p>
        ) : (
          <>
            <p>
              This MCP server requires authentication. Please provide the
              following credentials.
            </p>

            {authFields.length > 0 && (
              <Form
                className='mcp-auth-modal-form'
                aria-label='mcp auth form'
              >
                <div>
                  {authFields.map((field, index) => {
                    const labelText = field.required ? (
                      <>
                        {field.label}{' '}
                        <span
                          className='required-asterisk'
                          aria-hidden='true'
                        >
                          *
                        </span>
                      </>
                    ) : (
                      field.label
                    )

                    return (
                      <div key={index}>
                        {field.input === 'password' ? (
                          <PasswordInput
                            id={`mcp-field-${index}`}
                            labelText={labelText}
                            value={creds[field.name] || ''}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(field.name, e.target.value)}
                            invalid={!!errors[field.name]}
                            invalidText={errors[field.name]}
                            required={field.required}
                            autoComplete='new-password'
                          />
                        ) : (
                          <TextInput
                            id={`mcp-field-${index}`}
                            labelText={labelText}
                            value={creds[field.name] || ''}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(field.name, e.target.value)}
                            invalid={!!errors[field.name]}
                            invalidText={errors[field.name]}
                            required={field.required}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </Form>
            )}
          </>
        )}

        {!isNoAuth && (
          <InlineNotification
            kind='info'
            title='Security Note'
            subtitle='Credentials are stored locally in your browser and are only sent to the MCP server when needed.'
            lowContrast
            hideCloseButton
          />
        )}
      </div>
    </Modal>
  )
}
