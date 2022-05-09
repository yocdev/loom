# loom
应用于小程序的自动生成路由配置文件、类型文件，处理 icon 的自动化工具

# 使用
## 下载
```shell
npm install @yocdev/loom --dev
// 或者
yarn add @yocdev/loom --dev
```
## 使用
在根目录下添加配置文件 loom.config.ts
### 示例
```ts
import { defineConfig } from '@yocdev/loom'

export default defineConfig({
  // 路由处理配置文件
  router: {
    // 扫瞄文件
    include: ['src/**/pages/*/index.ts[x]'],
    exclude: [],
    // 产物输出地址
    output: 'src/__generated__/router',
    transformPageInfo(pageInfo) {
      const { folderPath } = pageInfo

      return {
        ...pageInfo,
        folderPath: folderPath.replace('src/', '') + '/index'
      }
    },
    transformRouterJson(routerJson) {
      const { pageTypeMapping } = routerJson

      const subPackagePaths: string[] = [];

      const routerSource = Object.keys(pageTypeMapping).reduce((res, key) => {
        const { folderPath } = pageTypeMapping[key]
        const isSubPackagePage = folderPath.includes('package')

        if (isSubPackagePage) {
          subPackagePaths.push(folderPath)
          return res
        }
        return {
          ...res,
          [key]: folderPath
        }
      }, {})

      const packageMapping = subPackagePaths.reduce((res, path) => {
        const packageName = path.match(/(package\w+)/)?.[1] || ''
        const relationPath = path.match(/package\w+\/([\S]*)/)?.[1] || ''

        const originPackageInfo = res[packageName] || {
          root: packageName,
          name: packageName,
          pages: []
        }

        originPackageInfo.pages.push(relationPath)

        return {
          ...res,
          [packageName]: originPackageInfo
        }

      }, {})

      return {
        ...routerJson,
        routerSource,
        subpackages: Object.values(packageMapping)
      }
    }
  },
  icon: [
    {
      include: ['src/assets/icons/*.svg'],
      exclude: [],
      filePrefix: 'Icon',
      output: 'src/__generated__/icons',
    },
    {
      include: ['src/assets/svgs/*.svg'],
      exclude: [],
      filePrefix: 'Svg',
      output: 'src/__generated__/svgs',
    },
  ],
})
```
### 项目中的设置约定
给对应页面配置 route.config.ts
配置示例
```ts
export const pageName = '页面标题';

// 页面入参
export interface PageParams {
  name: string;
}
```

# 常见问题处理

## sharp 安装时需要

```shell
npm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"
npm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
npm install sharp
```
