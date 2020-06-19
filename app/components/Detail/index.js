import './index.scss'
import Link from 'next/link'

const Detail = ((props) => {

    return (
        <div className="detail_MainContainer">
            <div className="col1">
                <div className="coverImage"></div>
                <div className="contactInfo_Container">
                    <p>Telf</p>
                    <p>Email</p>
                    <p>Instagram</p>
                    <p>Facebook</p>
                </div>
            </div>
            <div className="col2">
                <div className="titleAndFavSection_Container">
                    <h2>Business Name</h2>
                    <p> Location Icon </p>
                    <div className="titleIcons">
                        <p>200</p>
                        <img className="detailLikeIcon" src={require('../../img/feastey_likeIcon.png')} />
                        <img className="detailFavIcon" src={require('../../img/feastey_favoriteIcon.png')} />
                    </div>
                </div>
                <p>Adress</p>
                <p>Bussiness Description</p>
                <div className="section_Container">
                    <h2>Section Title</h2>
                    <div className="file_Container">
                        <h3>File</h3>
                    </div>
                </div>
                <div className="gallery_Container">
                    <div>
                        <h2>Gallery Component</h2>
                    </div>
                </div>
            </div>
        </div>
    )
})


export default Detail