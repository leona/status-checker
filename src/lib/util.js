import fs from 'fs'

const currentPath = process.cwd();

export function timestamp() {
  return new Date().getTime()
}

export async function importAll(path) {
	const files = fs.readdirSync(`${currentPath}/${path}`).filter(file => file.endsWith('.js'));
  let output = {}

	for (const file of files) {
		output[file.split('.')[0]] = (await import(`${currentPath}/${path}/${file}`)).default
	}
	
  return output
}

export function xlog(){
  console.log.apply(console, ['XLOG', new Date().toISOString(), '-->', ...arguments]);
}

export function offsetDate(offset) {
  let date = new Date()
  date.setDate(date.getDate() + offset)
  return date
}

export function eachDates(count) {
  let dates = [];

  for (let i = 0; i < count; i++) {
    let date = new Date(new Date().setDate(new Date().getDate() - i))

    dates.push(`${date.getDate()}/${date.getMonth() + 1}`);
  }

  return dates
}

export const nth = function(d) {
  const dString = String(d);
  const last = +dString.slice(-2);
  if (last > 3 && last < 21) return 'th';
  switch (last % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}