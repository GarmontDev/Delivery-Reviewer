const VisibleFilesOptionBtn = ({ showVisibleFiles, setShowVisibleFiles }) => {
  return (
    <>
      <form className="md:w-[768px]">
        <select
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset"
          onChange={(e) => setShowVisibleFiles(JSON.parse(e.target.value))}
        >
          <option value={true} defaultValue={showVisibleFiles}>
            Albaranes Activos
          </option>
          <option value={false} defaultValue={!showVisibleFiles}>
            Albaranes Inactivos
          </option>
        </select>
      </form>
    </>
  );
};

export default VisibleFilesOptionBtn;
