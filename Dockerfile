FROM node:20-alpine AS frontend-build
WORKDIR /src
COPY ExpensesManagementApp/ClientApp/package*.json ./
RUN npm ci
COPY ExpensesManagementApp/ClientApp/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ExpensesManagementApp/ExpensesManagementApp.csproj", "ExpensesManagementApp/"]
RUN dotnet restore "ExpensesManagementApp/ExpensesManagementApp.csproj"

COPY ExpensesManagementApp/ ExpensesManagementApp/
WORKDIR "/src/ExpensesManagementApp"

COPY --from=frontend-build /src/dist ./wwwroot

RUN dotnet build "ExpensesManagementApp.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ExpensesManagementApp.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ExpensesManagementApp.dll"]
