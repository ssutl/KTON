import React from "react";

import htmlToImage from "html-to-image";
import download from "downloadjs";
import { toPng, toJpeg } from "html-to-image";
import ImgDisplay from "../ImgDisplay/ImgDisplay";

class ImgGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topText: "",
      randomImg: "https://assets.imgix.net/unsplash/motorbike.jpg",
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  //Add local image
  handleUpload = (event) => {
    event.preventDefault();
    const { files } = event.target;
    const uploadFile = URL.createObjectURL(files[0]);
    this.setState({
      randomImg: uploadFile,
    });
  };

  //Add random image
  handleRandom = (event) => {
    event.preventDefault();
    const randNum = Math.floor(Math.random() * this.state.allTextImgs.length);
    const randTextImg = this.state.allTextImgs[randNum].url;
    this.setState({ randomImg: randTextImg });
  };

  //Download PNG image
  handlePng = () => {
    toPng(document.getElementById("my-img")).then(function (dataUrl) {
      download(dataUrl, "text-img.png");
    });
  };

  // Download JPEG image
  handleJpeg = () => {
    toJpeg(document.getElementById("my-img"), { quality: 0.95 }).then(function (
      dataUrl
    ) {
      var link = document.createElement("a");
      link.download = "text-img.jpeg";
      link.href = dataUrl;
      link.click();
    });
  };

  render() {
    return (
      <ImgDisplay
        handleChange={this.handleChange}
        handleRandom={this.handleRandom}
        handlePng={this.handlePng}
        handleJpeg={this.handleJpeg}
        handleUpload={this.handleUpload}
        data={this.state}
      />
    );
  }
}

export default ImgGenerator;
