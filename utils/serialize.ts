// MIT License
// https://github.com/pravdomil/React-Serialize

import React from 'react'

/**
 * Serialize React element to JSON string
 */
export function serialize(element: React.ReactNode): string {
  function replacer(this: any, key: string, value: any) {
    switch (key) {
      case '_owner':
      case '_store':
      case 'ref':
      case 'key':
        return
      case 'mdxType':
      case 'originalType':
        return
      case 'type':
        if (this.props.originalType) {
          return this.props.originalType
        }

        if (typeof value === 'string') {
          return value
        }
        if (value === React.Fragment) {
          return '<>'
        }
        return value.displayName || value.name
      default:
        return value
    }
  }

  return JSON.stringify(element, replacer)
}

type Options = {
  components?: Record<string, React.Component>
  reviver?: (
    type: any,
    props: Record<string, any>,
    key: number | undefined,
    components: Record<string, React.Component>
  ) => {
    type: any
    props: Record<string, any>
    key: number | undefined
    components: Record<string, React.Component>
  }
}

/**
 * Deserialize JSON string to React element
 */
export function deserialize(data: string | object, options?: Options) {
  if (typeof data === 'string') {
    data = JSON.parse(data)
  }
  if (data instanceof Object) {
    return deserializeElement(data, options)
  }
  throw new Error('Deserialization error: incorrect data type')
}

function deserializeElement(
  element: any,
  options: Options = {},
  key?: number
): React.ReactNode {
  let { components = {}, reviver } = options

  if (typeof element !== 'object') {
    return element
  }

  if (element === null) {
    return element
  }

  if (element instanceof Array) {
    return element.map((el, i) => deserializeElement(el, options, i))
  }

  // Now element has following shape { type: string, props: object }

  let { type, props } = element

  if (typeof type !== 'string') {
    throw new Error('Deserialization error: element type must be string')
  }

  if (type === '<>') {
    type = React.Fragment
  } else {
    type = components[type] || type.toLowerCase()
  }

  if (props.children) {
    props = { ...props, children: deserializeElement(props.children, options) }
  }

  if (reviver) {
    ;({ type, props, key, components } = reviver(type, props, key, components))
  }

  return React.createElement(type, { ...props, key })
}
