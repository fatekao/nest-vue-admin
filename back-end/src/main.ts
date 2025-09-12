import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * 应用启动函数
 * 初始化应用并启动 HTTP 服务器
 */
async function bootstrap() {
  // 创建 NestJS 应用实例
  const app = await NestFactory.create(AppModule);

  // CORS 跨域配置
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*', // 允许的源
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'], // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    credentials: true, // 是否允许携带凭证
    maxAge: 86400, // 预检请求缓存时间（秒）
  });

  // Swagger API 文档配置
  const options = new DocumentBuilder()
    .setTitle('NestJS API') // 文档标题
    .setDescription('The NestJS API description') // 文档描述
    .setVersion('1.0') // API 版本
    .addTag('nestjs') // 默认标签
    .build();

  // 创建并挂载 Swagger 文档
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api-json', // 明确指定 JSON 文档路径
    yamlDocumentUrl: 'api-yaml', // 明确指定 YAML 文档路径
  });

  // 启动应用并监听指定端口
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
