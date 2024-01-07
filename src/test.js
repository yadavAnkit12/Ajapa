
const arr = [{ day: "monday1", start: "", end: "" }];
const handleChange = (index, value, type) => {

    if (type == "start") {
      if (arr.length > 1) {
        if (arr[index]?.start < arr[index - 1]?.start) {
          return;
        }
  
      }
      if (!end) {
        setValue(value)
      } else if (start < end) {
        setValue(value)
      }
    } else {
      if (arr.length > 1) {
        if (arr[index]?.end < arr[index - 1]?.end) {
          return;
        }
      }
      if (!start) {
        setValue(value)
      } else if (end > start) {
        setValue(value)
      }
    }
  }
  
  arr.map((obj, index) => {
    <>
      <input onChnage={(value) => { handleChange(index, value, type) }}></input>
      <input onChnage={(value) => { handleChange(index, value, type) }}></input>
    </>
  })
  
  //  < button onclick = {()=> { arr.push({{ day: "monday1", start: "", end: "" }})}}></button >