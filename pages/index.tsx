import React, { useState } from 'react'
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


export const getStaticProps: GetStaticProps = async () => {

  const feed = [
    {
      id: "1",
      title: "Prisma is the perfect ORM for Next.js",
      content: "[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!",
      published: false,
      author: {
        name: "Nikolas Burk",
        email: "burk@prisma.io",
      },
    },
  ]
  return {
    props: { feed },
    revalidate: 10
  }
}

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {

    const [rowData, setRowData] = useState([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    const [colDefs, setColDefs] = useState([
      { field: "make" } as ColDef,
      { field: "model" } as ColDef,
      { field: "price" } as ColDef,
      { field: "electric" } as ColDef
    ]);

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          <div
              className="ag-theme-alpine"
              style={{height: '600px'}}
          >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
            ></AgGridReact>
          </div>
          {/*{props.feed.map((post) => (*/}
          {/*    <div key={post.id} className="post">*/}
          {/*      <Post post={post}/>*/}
          {/*    </div>*/}
          {/*))}*/}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
