@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION
SET BASEDIR=%~dp0
SET MVNW_HOME=%BASEDIR%\.mvn\wrapper
SET JAR=%MVNW_HOME%\maven-wrapper.jar
SET PROPERTIES=%MVNW_HOME%\maven-wrapper.properties

IF NOT EXIST "%JAR%" (
  ECHO Downloading Maven Wrapper...
  powershell -Command "try { Invoke-WebRequest -Uri https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar -OutFile '%JAR%' -UseBasicParsing } catch { Write-Error $_; exit 1 }"
)

"%JAVA_HOME%\bin\java" -Dmaven.multiModuleProjectDirectory=%BASEDIR% -classpath "%JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
ENDLOCAL
