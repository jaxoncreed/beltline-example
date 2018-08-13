
export default function(beltline) {
  if (beltline.isServer) {
    beltline.publish('personList', () => {
      return 
    })
  }
}