import imgRectangle1 from "figma:asset/e3d5eaa1fada5ef720e2b6964fe4142c602824b0.png";
import imgImage1 from "figma:asset/b56e7596d60732bd89b65afcd72165601147f3b3.png";

export default function Login() {
  return (
    <div className="bg-white relative size-full" data-name="LOGIN 1">
      <div className="absolute h-[1024px] left-0 top-0 w-[1440px]">
        <div className="absolute inset-[-0.39%_-0.28%]">
          <img alt="" className="block max-w-none size-full" height="1032" src={imgRectangle1} width="1448" />
        </div>
      </div>
      <div className="absolute bg-white h-[599px] left-1/2 rounded-[27px] top-[263px] translate-x-[-50%] w-[538px]">
        <div aria-hidden="true" className="absolute border border-[#f5ba3c] border-solid inset-[-0.5px] pointer-events-none rounded-[27.5px] shadow-[0px_4px_250px_50px_rgba(140,3,14,0.89),0px_16px_32px_-4px_rgba(12,12,13,0.1)]" />
      </div>
      <p className="absolute font-['Inter:Extra_Light',sans-serif] font-extralight leading-[normal] left-[595px] not-italic text-[20px] text-black text-nowrap top-[433px] whitespace-pre">Gestión de Calificaciones</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[29px] leading-[normal] left-[585px] not-italic text-[#8c030e] text-[30px] top-[388px] w-[355px]">Plataforma Escolar</p>
      <div className="absolute left-[calc(50%-0.5px)] size-[125px] top-[269px] translate-x-[-50%]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[512px] not-italic text-[20px] text-black text-nowrap top-[484px] whitespace-pre">Correo Electrónico</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[515px] not-italic text-[20px] text-black text-nowrap top-[606px] whitespace-pre">Contraseña</p>
      <div className="absolute h-[79px] left-[423px] top-[317px] w-[448px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Rectangle 3"></g>
        </svg>
      </div>
      <div className="absolute bg-[#fdf8f8] h-[47px] left-[512px] rounded-[15px] top-[649px] w-[412px]">
        <div aria-hidden="true" className="absolute border border-[#8c030e] border-solid inset-0 pointer-events-none rounded-[15px] shadow-[0px_4px_4px_4px_rgba(0,0,0,0.25)]" />
      </div>
      <div className="absolute bg-[#fdf8f8] h-[47px] left-[515px] rounded-[15px] top-[527px] w-[412px]">
        <div aria-hidden="true" className="absolute border border-[#8c030e] border-solid inset-0 pointer-events-none rounded-[15px] shadow-[0px_4px_10px_5px_rgba(0,0,0,0.25)]" />
      </div>
      <p className="[text-shadow:#af787c_0px_4px_4px] absolute font-['Inter:Black',sans-serif] font-black leading-[normal] left-[585px] not-italic text-[#8c030e] text-[30px] text-nowrap top-[804px] whitespace-pre">EJEMPLO DE VIDA</p>
      <div className="absolute bg-[#0433bf] h-[57px] left-[601px] rounded-[15px] shadow-[0px_4px_5px_5px_rgba(0,0,0,0.2)] top-[728px] w-[234px]" />
      <p className="[text-shadow:#000000_0px_4px_10px] absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic right-[788px] text-[20px] text-nowrap text-white top-[745px] translate-x-[100%] whitespace-pre">Iniciar Sessión</p>
    </div>
  );
}