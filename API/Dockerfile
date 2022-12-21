FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app
EXPOSE 8080

#copy csproj and restore as distince layers
COPY *.csproj ./
RUN  dotnet restore

#copy everything else adn build
COPY . ./
RUN dotnet publish -c Release -o out

# build runtiime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet","API.dll"]
