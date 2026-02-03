pipeline {
 
  agent {
        node {
            label 'lovely-erp-node-1'
        }
  }


 environment {
        SUDO_ASKPASS = '/usr/local/bin/askpass.sh'
    
 }
  
  stages {


  stage('Check Version') {
      steps {
        sh 'echo "Current node version is \$(node -v)"'
           sh 'echo "Current npm version is \$(npm -v)"'
     
      }  
    }

 

    
 
        
  
   stage('Clone Repository'){
            steps{

 checkout scm: [$class: 'GitSCM', branches: [[name: '*/main']],extensions: [], userRemoteConfigs: [[credentialsId: 'francisGit', url: 'https://github.com/francis477/kilo-erp-frontend.git']]] 
                    
        }
      }



        

        //      stage('OWASP FS SCAN') {
        //     steps {
        //         dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
        //         dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
        //     }
        // }

        //  stage('Install Trivy') {
        //     steps {
        //         sh '''
        //             sudo -A apt-get install wget apt-transport-https gnupg lsb-release -y
        //             wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
        //             echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
        //             sudo -A apt-get update
        //             sudo -A apt-get install trivy -y
        //         '''
        //     }
        // }

        // stage('TRIVY FS SCAN') {
        //     steps {
        //           sh 'trivy --version'  // Verify installation
        //         sh "trivy fs . > trivyfs.json"
        //     }
        // }

        


   stage('Install Dependencies') {
            steps {
               script {
                   env.PATH="/home/wml/jenkins/.nvm/versions/node/v20.11.1/bin:${env.PATH}"
                   sh "cat /home/wml/jenkins/secret/erp.com > /home/wml/jenkins/workspace/erp.com/.env"
                   sh 'node -v'
                   sh 'yarn'
              
               }
            }
        }

   


            stage('Building App') {
            steps {
               script {
                   env.PATH="/home/wml/jenkins/.nvm/versions/node/v20.11.1/bin:${env.PATH}"
                   sh 'cd /home/wml/jenkins/workspace/erp.com && yarn build'


               }
            }
        }


         stage('Setup Directory') {
            steps {
               sh 'sudo -A rm -rf /var/www/html/erp.com'
                sh 'mkdir -p /var/www/html/erp.com'
                  sh 'sudo -A mkdir -p /var/www/html/erp.com'
                  sh 'sudo -A chmod -R 755 /var/www/html/erp.com'
                   sh 'sudo -A chown -R `whoami`:wml /var/www/html/erp.com'
                    sh 'sudo chown -R wml:wml /var/www/html/erp.com'
                    sh 'sudo chown -R www-data:www-data /var/www/html/erp.com'
                    sh 'sudo -A cp -r /home/wml/jenkins/workspace/erp.com/* /var/www/html/erp.com/'
                    
            }
        }
        


    stage('Check and Delete PM2 Process') {
            steps {
                script {
                  // Check if the PM2 process exists
                    def isRunning = sh(script: 'pm2 list | grep -w "erp.com"', returnStatus: true) == 0

                    if (isRunning) {
                        // If the application is running, attempt to delete it
                        def deleteStatus = sh(script: 'pm2 delete "erp.com"', returnStatus: true)

                        if (deleteStatus != 0) {
                            echo 'Failed to delete PM2 process: erp.com (it may not exist)'
                        } else {
                            echo 'Deleted PM2 process: erp.com'
                        }
                    } else {
                        echo 'PM2 process erp.com does not exist.'
                    }
                }
            }
        }


               stage('Deploy') {
            steps {

    
               script {
    sh 'pm2 start npm --name "erp.com" -- start'
        sh 'pm2 restart erp.com --cron-restart="0 0 * * *"'
        sh 'pm2 save --force'

     
               }
            }
        }

    
 
        
  }

 post {

    always {

  script {
 

                // Send email notification
      emailext (
                    subject: "Jenkins Pipeline - Build #${env.BUILD_NUMBER}",
                    body: """<p>Build #${env.BUILD_NUMBER} of ${env.JOB_NAME} has finished with status: ${currentBuild.currentResult}</p>
                             <p>Check the details <a href="${env.BUILD_URL}">here</a></p>""",
                    to: "$EMAIL_RECEPIENTS",
                    mimeType: 'text/html'
                )
      // cleanWs()


    
    }

    }

    }
  






  
}
 