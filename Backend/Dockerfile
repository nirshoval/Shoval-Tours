# Building the image:
    
FROM node:20-alpine3.19
WORKDIR /app
COPY package.json /app
RUN npm i
COPY . /app
EXPOSE 4000 

# -------------------------------------------------------------------------------

# When container starts,  Which terminal command runs the app:
CMD ["npm", "start"]
