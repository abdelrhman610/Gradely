FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY GradelySolution.sln ./
COPY Gradely.Api/*.csproj Gradely.Api/
COPY Gradely.Application/*.csproj Gradely.Application/
COPY Gradely.Domain/*.csproj Gradely.Domain/
COPY Gradely.Infrastructure/*.csproj Gradely.Infrastructure/
RUN dotnet restore

COPY . .
RUN dotnet publish Gradely.Api/Gradely.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Gradely.Api.dll"]
