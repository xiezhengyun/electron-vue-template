# windows 写入electron的唤起协议
# !macro 定义宏
# customInstall 会在安装文件后自动调用
# DetailPrint 执行打印
# DeleteRegKey 删除原有的注册表
# WriteRegStr 写入注册表
# $INSTDIR 所选的文件安装路径

!macro customInstall
  DeleteRegKey HKCR "pacsclient"
  WriteRegStr HKCR "pacsclient" "" "URL:pacsclient"
  WriteRegStr HKCR "pacsclient" "URL Protocol" ""
  WriteRegStr HKCR "pacsclient\shell" "" ""
  WriteRegStr HKCR "pacsclient\shell\Open" "" ""
  WriteRegStr HKCR "pacsclient\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "pacsclient"
!macroend
