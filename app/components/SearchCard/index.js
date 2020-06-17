import './index.scss'
import Link from 'next/link'

export default ((props) => {
    return (
        <div className="searchCard_Container">
            <div className="searchCard_imgContainer">
                <div className="searchCard_img"></div>
            </div>
            <div className=" searchCard_infoContainer">
                <div className="searchCard_infoContainer_Header">
                    <h2>Bussines Title</h2>
                    <div className="favorite_Container">
                        <img className="favoriteIconCard" src={require('../../img/feastey_favoriteIcon.png')}></img>
                    </div>
                </div>
                <p>Adress</p>
                <p className="searchCard_infoContainer_Description">Bussiness description</p>
                <div className="cardFooter">
                    <p>Category</p>
                    <div className="likesContainer">
                        <p>200</p>
                        <img className="likesIconCard" src={require("../../img/feastey_likeIcon.png")}></img>
                    </div>

                </div>
            </div>

        </div>
    )
})