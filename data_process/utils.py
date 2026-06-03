import numpy as np
import xarray as xr


def build_encoding(ds: xr.Dataset, add_fill_value=False) -> dict:
    """Build an encoding dictionary for efficient Zarr storage.

    Args:
        ds: The xarray Dataset for which to build the encoding.
        add_fill_value: Whether to add a fill value for the 'age_of_sea_ice' variable.

    Returns:
        A dictionary suitable for use as the encoding argument in to_zarr.
    """
    encoding = {}

    for var in ds.data_vars:
        dims = ds[var].dims

        if dims == ("time", "y", "x"):
            encoding[var] = {"chunks": (1, ds.sizes["y"], ds.sizes["x"])}
        if dims == ("month", "y", "x"):
            encoding[var] = {"chunks": (1, ds.sizes["y"], ds.sizes["x"])}

        elif dims == ("time", "nv"):
            encoding[var] = {"chunks": (1, ds.sizes["nv"])}
        elif dims == ("month", "nv"):
            encoding[var] = {"chunks": (1, ds.sizes["nv"])}

        elif dims == ("time",):
            encoding[var] = {"chunks": (ds.sizes["time"],)}
        elif dims == ("month",):
            encoding[var] = {"chunks": (ds.sizes["month"],)}


        if var == "age_of_sea_ice" and add_fill_value:
            encoding.setdefault(var, {})
            encoding[var].update(
                {
                    "dtype": "uint8",
                    "_FillValue": 21,
                    "fill_value": 21,
                }
            )

    for coord in ds.coords:
        dims = ds[coord].dims

        if dims == ("y", "x"):
            encoding[coord] = {"chunks": (ds.sizes["y"], ds.sizes["x"])}

        elif dims == ("x",):
            encoding[coord] = {"chunks": (ds.sizes["x"],)}

        elif dims == ("y",):
            encoding[coord] = {"chunks": (ds.sizes["y"],)}

        elif dims == ("time",):
            encoding[coord] = {"chunks": (ds.sizes["time"],)}
        elif dims == ("month",):
            encoding[coord] = {"chunks": (ds.sizes["month"],)}

    return encoding

def convert_to_6931(ds: xr.Dataset) -> xr.Dataset:
    """Convert a dataset with EASE-Grid 2.0 coordinates to EPSG:6931.

    Args:
        ds: The input xarray Dataset with 'xc' and 'yc' coordinates in kilometers.

    Returns:
        A new xarray Dataset with 'x' and 'y' coordinates in meters and CRS set to EPSG:6931.
    """
    ds_arctic = ds.copy()

    ds_arctic = ds_arctic.rename({
        "xc": "x",
        "yc": "y",
    })

    # Convert x/y from km to metres
    ds_arctic = ds_arctic.assign_coords(
        x=ds_arctic["x"] * 1000.0,
        y=ds_arctic["y"] * 1000.0,
    )

    ds_arctic["x"].attrs.update({
        "standard_name": "projection_x_coordinate",
        "long_name": "x coordinate of projection",
        "units": "m",
        "axis": "X",
    })

    ds_arctic["y"].attrs.update({
        "standard_name": "projection_y_coordinate",
        "long_name": "y coordinate of projection",
        "units": "m",
        "axis": "Y",
    })

    ds_arctic = ds_arctic.rio.write_crs("EPSG:6931")
    for var in ["sea_ice_thickness", "uncertainty", "quality_flag", "status_flag"]:
        if var in ds_arctic:
            ds_arctic[var].attrs["grid_mapping"] = "spatial_ref"

    ds_arctic = ds_arctic.rio.set_spatial_dims(x_dim="x", y_dim="y")
    return ds_arctic

def prepare_ice_age_dataset(ds: xr.Dataset) -> xr.Dataset:
    """Prepare the ice age dataset for storage and visualization.

    Args:
        ds: The input xarray Dataset containing the ice age data.

    Returns:
        A new xarray Dataset with standardized coordinates, attributes, and CRS information.
    """
    ds = ds.copy()

    # Convert object time to datetime64[ns], but only if time exists as a coordinate
    if "time" in ds.coords:
        ds = ds.assign_coords(
            time=xr.DataArray(
                np.asarray(ds["time"].values, dtype="datetime64[ns]"),
                dims="time",
                name="time",
            )
        )

    ds["x"].attrs.update({
        "standard_name": "projection_x_coordinate",
        "long_name": "x coordinate of projection",
        "units": "m",
        "axis": "X",
    })

    ds["y"].attrs.update({
        "standard_name": "projection_y_coordinate",
        "long_name": "y coordinate of projection",
        "units": "m",
        "axis": "Y",
    })

    # Convert latitude(time, y, x) -> lat(y, x)
    # drop=True removes the scalar time coordinate from the selected slice.
    if "latitude" in ds and ds["latitude"].dims == ("time", "y", "x"):
        lat2d = ds["latitude"].isel(time=0, drop=True).rename("lat")
        ds = ds.drop_vars("latitude")
        ds = ds.assign_coords(lat=lat2d)

    # Convert longitude(time, y, x) -> lon(y, x)
    if "longitude" in ds and ds["longitude"].dims == ("time", "y", "x"):
        lon2d = ds["longitude"].isel(time=0, drop=True).rename("lon")
        ds = ds.drop_vars("longitude")
        ds = ds.assign_coords(lon=lon2d)

    # Convert crs(time) -> scalar crs
    crs_attrs = {}
    if "crs" in ds:
        crs_attrs = dict(ds["crs"].attrs)
        ds = ds.drop_vars("crs")

    ds["crs"] = xr.DataArray(0, attrs=crs_attrs)

    if "age_of_sea_ice" in ds:
        ds["age_of_sea_ice"].attrs["grid_mapping"] = "crs"

    ds.attrs.update({
        "title": "Age of sea ice",
        "crs": "EPSG:3408",
        "proj4": "+proj=laea +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs",
    })

    return ds


def generate_monthly_climatology(
    ds: xr.Dataset,
    var_name: str = "age_of_sea_ice",
    keep_attrs: bool = True,
) -> xr.Dataset:
    """ Generate a monthly climatology from the input dataset by averaging over all years for each calendar month.

    Args:
        ds: The input xarray Dataset containing the data to be averaged. Must have a 'time' coordinate and the specified variable.
        var_name: The name of the variable in the dataset for which to compute the monthly climatology. Default is 'age_of_sea_ice'.
        keep_attrs: Whether to keep the attributes of the original dataset in the output. Default is
            True.

    Raises:
        ValueError: If the dataset does not contain a 'time' coordinate or if the specified variable is not found in the dataset.
        TypeError: If the 'time' coordinate is not datetime-like.

    Returns:
        An xarray Dataset containing the monthly climatology of the specified variable, with dimensions ('month', 'y', 'x').
    """
    if "time" not in ds.coords:
        raise ValueError("Dataset must contain a 'time' coordinate.")

    if var_name not in ds.data_vars:
        raise ValueError(f"Variable '{var_name}' not found in dataset.")

    if not np.issubdtype(ds["time"].dtype, np.datetime64):
        raise TypeError("'time' coordinate must be datetime-like.")

    data = ds[[var_name]].astype({var_name: "float32"})

    monthly_clim = data.groupby("time.month").mean(
        dim="time",
        keep_attrs=keep_attrs,
    )

    for coord in ["lat", "lon"]:
        if coord in ds.coords:
            monthly_clim = monthly_clim.assign_coords({coord: ds[coord]})

    if "crs" in ds:
        monthly_clim["crs"] = ds["crs"]

    monthly_clim.attrs = ds.attrs.copy()
    monthly_clim.attrs["description"] = (
        "Monthly climatological mean: each month is averaged across all years."
    )

    return monthly_clim
