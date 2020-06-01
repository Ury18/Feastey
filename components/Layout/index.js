import './index.scss'


export default ((props) => {
    console.log(props)
    return (
        <div className="app">
            <header>
                <h1>FEASTEY</h1>
            </header>
            {props.children}
        </div>
    )
})

