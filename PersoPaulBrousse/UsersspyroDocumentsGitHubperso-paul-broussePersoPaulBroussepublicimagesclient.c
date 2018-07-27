#include<stdio.h>
#include<string.h>
#include<sys/socket.h>
#include<arpa/inet.h>
#include<unistd.h>

int main(int argc, char *argv[])
{
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    int connected = 0;
    char message[1000], server_reply[2000];

    struct sockaddr_in server;

    if (sock == -1)
    {
        perror("Impossible de créer la socket");
        return 1;
    }

    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_family = AF_INET;
    server.sin_port = htons(8888);

    if (connect(sock, (struct sockaddr *)&server, sizeof(server)) < 0)
    {
        perror("Impossible de se connecter au server !");
        return 1;
    }

    while(1)
    {
        printf("Entrez votre message : ");
        scanf("%s" , message);

        if(strcmp(message, "ls") == 0 && connected == 1){
            readLs();
            continue;
        }
        else if(strcmp(message, "pwd") == 0 && connected == 1){
            pwd();
            continue;
        }
        else if(strcmp(message, "cd") == 0 && connected == 1){
            printf("Entrez le nom du dossier à atteindre : ");
            scanf("%s", message);
            goTo(message);
            continue;
        }
        else if(strcmp(message, "rm") == 0 && connected == 1){
            printf("Entrez le nom du fichier ou dossier à supprimer : ");
            scanf("%s", message);
            rm(message);
            continue;
        }

        if(send(sock, message, strlen(message) + 1, 0) < 0)
        {
            perror("L'envoie a échoué");
            return 1;
        }

        if(recv(sock, server_reply, 2000, 0) < 0)
        {
            perror("La réception a échoué");
            return 1;
        }

        puts("Réponse du server :");
        
        if(strcmp(server_reply, "ERRORCONNECTION") == 0){
            puts("Vous avez épuisez vos essais");
            break;
        }
        else if(strcmp(server_reply, "WHO") == 0){
            puts("Tapez votre pseudo");
        }
        else if(strcmp(server_reply, "PASSWD") == 0){
            puts("Tapez votre mot de passe");
        }
        else if(strcmp(server_reply, "CONNECTED") == 0){
            puts("Vous êtes bien connecté !");
            connected = 1;
        }
        else if(strcmp(server_reply, "UNKNOWNWHO") == 0){
            puts("Cette combinaison n'existe pas, tapez votre pseudo");
        }
        else if(strcmp(server_reply, "NOTCONNECT") == 0){
            puts("Vous n'êtes pas connecté, tapez BONJ pour vous connecter");
        }
        else if(strcmp(server_reply, "ASKFORCD") == 0){
            puts("Veuillez saisir le dossier auquel accéder");
        }
        else if(strcmp(server_reply, "NOCD") == 0){
            puts("Le dossier n'existe pas");
        }
        else if(strcmp(server_reply, "CDOk") == 0){
            puts("Dossier atteint");
        }
        else if(strcmp(server_reply, "UNKNOWACTION") == 0){
            puts("Action non reconnue");
        }
        else {
            puts(server_reply);
        }
    }

    close(sock);
    return 0;
}

int pwd(){

    char cwd[1024];
    getcwd(cwd, sizeof(cwd));
    printf("Le répertoire courant est: %s\n", cwd);
}

int readLs(){

    FILE *fp;
    char path[1035];
    char cwd[1024];
    getcwd(cwd, sizeof(cwd));
    char command[1024];
    strcpy(command, "/bin/ls -l ");
    strcat(command, cwd);

    fp = popen(command, "r");
    if(fp == NULL){
        printf("Failed\n");
        return 1;
    }

    while(fgets(path, sizeof(path)-1, fp) != NULL){
        printf("%s", path);
    }

    pclose(fp);
    return 0;
}

int goTo(char *chemin){
    int ret = chdir(chemin);
    if(ret){
        printf("Le dossier n'existe pas.\n");
        return 1;
    }
    else {
        printf("Dossier %s atteint.\n", chemin);
        return 0;
    }
}

int rm(char *chemin){
    char path[1024];
    char cwd[1024];
    getcwd(cwd, sizeof(cwd));
    strcpy(path, cwd);
    strcat(path, "/");
    strcat(path, chemin);
    int ret = remove(path);
    if(ret == 0){
        printf("Le fichier ou dossier a bien été supprimé\n");
        return 0;
    }
    else {
        printf("Le fichier de path %s n'existe pas\n", path);
        return 1;
    }
}
