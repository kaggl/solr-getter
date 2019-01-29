const Http = new XMLHttpRequest();
function getSolr() {
  Http.open("GET", document.getElementById("input").value);
  Http.send();
  Http.onreadystatechange = (e) => {
    const obj = JSON.parse(Http.responseText);
    const ret = [];
    console.log(obj);
    for (let i = 0; i < obj.response.docs.length; i += 1) {
      if (obj.highlighting[obj.response.docs[i].id]._text_) {
        obj.response.docs[i].highlight = obj.highlighting[obj.response.docs[i].id]._text_[0];
        ret.push(obj.response.docs[i]);
      }
    }
    console.log(ret);
    document.getElementById("output").innerText = JSON.stringify(ret, null, "\t");
  }
}
