export default {
  length: (min, max) => ({ min, max, message: `长度在 ${min} 到 ${max} 个字符`, trigger: 'blur' }),
  min: (min) => ({ min, message: `长度最少为 ${min} 个字符`, trigger: 'blur' }),
  max: (max) => ({ max, message: `长度最多为 ${max} 个字符`, trigger: 'blur' }),
  email: { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱地址', trigger: 'blur' },
  phone: { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  password: { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, message: '密码至少8位，需包含大小写字母、数字和特殊字符', trigger: 'blur' }
}
