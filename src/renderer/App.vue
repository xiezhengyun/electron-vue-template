<script setup lang="ts">
import Hello from './components/Hello.vue'

window.electronAPI.sendMessage('Hello from App.vue!')

window.electronAPI.handleCounter((event: any, value: number) => {
  const counter = document.getElementById('counter')
  const oldValue = Number(counter?.innerText)
  const newValue = oldValue + value
  if (counter) counter.innerText = String(newValue)
  event.sender.send('counter-value', newValue)
})

window.electronAPI.changeWin((event: any, value: string) => {
  console.log(value)
})

window.ipcRenderer.on('change-win2', (event, value) => {
  console.log('change-win2', value)
  event.sender.send('change-win2-back', 'xcxcc')
})

// 本地node 的 web服务 消息
window.ipcRenderer.on('ask', (event, value) => {
  console.log('ask', value)
  // event.sender.send('change-win2-back', 'xcxcc')
})
</script>

<template>
  <div id="app">
    Current value: <strong id="counter">0</strong>
    <Hello />
  </div>
</template>
