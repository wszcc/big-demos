const prodPlugin=[]
if(process.env.MODE_ENV==='production'){
  prodPlugin.push('transform-remove-console')
}




module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugin
  ]
}