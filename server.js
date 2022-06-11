const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = graphql
const app = express()
const pageData = require('./page-data.json')


app.get("/", (req, res)=>{
    res.end("Hello!");
})

app.listen(5000, ()=>console.log(`listening on port 5000`))

const PageType = new GraphQLObjectType({
    name: "page",
    fields: () => ({
        id: {
            type: GraphQLInt 
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        image_url: {
            type: GraphQLString
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
         getAllPages: {
              type: new GraphQLList(PageType),
              args: {
                
              },
              resolve(parent, args){
                return pageData
              }
         },
         getPage: {
            type: PageType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve(parent, args){
               return pageData.find(getPage => args.id == getPage.id);
            } 
         } 
    } 
})
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createPage: {
            type: PageType,
            args: {
                 title: {
                    type: GraphQLString
                 },
                 description: {
                    type: GraphQLString
                 },
                 image_url: {
                    type: GraphQLString
                 }
            },
            resolve(parent, args){
                pageData.push({id: pageData[pageData.length-1].id + 1, title: args.title, description: args.description, image_url: args.image_url})
                return args
            }
        },
        updatePage: {
            type: PageType,
            args: {
                id: {
                    type: GraphQLInt
                },
                title: {
                    type: GraphQLString
                 },
                 description: {
                    type: GraphQLString
                 },
                 image_url: {
                    type: GraphQLString
                 }
            },
            resolve(parent, args){
                const index = pageData.findIndex((getPage) => args.id == getPage.id);
                pageData[index].title = (args.title == null) ? pageData[index].title : args.title;
                pageData[index].description = (args.description == null) ? pageData[index].description : args.description;
                pageData[index].image_url = (args.image_url == null) ? pageData[index].image_url : args.image_url;
                return args;    
            }
        },
        deletePage: {
            type: PageType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve(parent, args){
                const index = pageData.findIndex((getPage) => args.id == getPage.id);
                pageData.splice(index, 1)
                return args
            }
        }
    }
})

const schema = new graphql.GraphQLSchema({query: RootQuery, mutation: Mutation})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

