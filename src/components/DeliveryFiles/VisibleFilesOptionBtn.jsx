const VisibleFilesOptionBtn = ({ showVisibleFiles, setShowVisibleFiles }) => {
  return (
    <>
      <form>
        <select
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onChange={(e) => (
            setShowVisibleFiles(JSON.parse(e.target.value))
          )}
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
