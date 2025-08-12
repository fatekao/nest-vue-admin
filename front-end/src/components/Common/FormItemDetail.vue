<template>
  <renderItem></renderItem>
</template>

<script setup lang="jsx" name="FtTableItem">
import dayjs from 'dayjs'
const data = defineProps({
  data: {
    type: Object
  },
  props: {
    type: Object
  }
})

const Enum = (row, props) => {
  const { value, dict } = props
  if (Array.isArray(row[value])) {
    const result = []
    dict.forEach(i => {
      if (row[value].includes(i.value)) {
        result.push(i.label)
      }
    })
    return (
      <span class={props.className}>
        {result.join(',') || '-'}
      </span>
    )
  } else {
    const item = dict.find(item => {
      return item.value === row[value]
    })
    if (item) {
      if (item.color) {
        return (
          <span class={[ props.className, item.className]}>
            <span class={['dot']} style={{ backgroundColor: item.color }}></span>
            {item.label}
          </span>
        )
      } else {
        return <span class={[props.className, item.className]}>{item.label}</span>
      }
    } else {
      ;<span>-</span>
    }
  }
}

const Time = (row, props) => {
  const { value, format } = props
  if (row[value]) {
    const result = dayjs(new Date(row[value])).format(format || 'YYYY-MM-DD HH:mm:ss')
    return <span>{result}</span>
  } else {
    return <span>-</span>
  }
}

const Numbers = (row, props) => {
  const { value, toFixed, multiple, unit } = props
  let result = Number(row[value]) / (multiple || 1)
  if (toFixed) {
    result = result.toFixed(toFixed)
  }
  return (
    <span>
      {result}
      {unit}
    </span>
  )
}

const Normal = (row, props) => {
  const { unit } = props
  const result = row[props.value]
  return (
    <span class={props.className} style={props.color ? `color: ${props.color}` : ''}>
      {result === '' || result === undefined || result === null ? '-' : result}
      {result === '' || result === undefined || result === null ? '' : unit}
    </span>
  )
}

const renderItem = () => {
  const props = data.props
  const row = data.data
  switch (props.type) {
    case 'enum':
      return Enum(row, props)
    case 'time':
      return Time(row, props)
    case 'number':
      return Numbers(row, props)
    default:
      return Normal(row, props)
  }
}
</script>
