function Map(props) {
    return (
        <div className="card">
            <img className="card__image" src={props.src} alt={props.detail} />
            <h3 className="card__detail">{props.detail}</h3>
        </div>
    )
}

export default Map;