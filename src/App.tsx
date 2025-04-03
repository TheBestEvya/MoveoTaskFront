import './App.css'
import Layout from './components/layout';
import { ThemeProvider } from "./context/ThemeContex";
import RouterComponent from './routes/router'


function App() {


  return (
    <>
     <ThemeProvider>
      <Layout>
      <RouterComponent />
      </Layout>
      </ThemeProvider>
    </>
  )
}

export default App
