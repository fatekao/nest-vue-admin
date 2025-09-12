const components = import.meta.glob('@/components/**/index.js')

export default {
  install(app) {
    // 使用 Promise.all 并行加载所有组件
    Promise.all(
      Object.keys(components).map(async (key) => {
        try {
          const component = await components[key]()
          Object.keys(component).forEach((name) => {
            app.component(component[name].name, component[name])

            // 开发环境添加组件注册日志
            if (import.meta.env.MODE === 'development') {
              console.log(`已注册组件: ${component[name].name}`)
            }
          })
        } catch (error) {
          console.error(`加载组件 ${key} 时出错:`, error)
        }
      })
    )
  }
}
